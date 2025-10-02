"use client";

import { Form, Input, Select, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./edit.module.css";

const { TextArea } = Input;
const { Option } = Select;

export default function Edit() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, taskResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/users"),
          axios.get(`http://localhost:4000/api/task/${taskId}`)
        ]);

        setUsers(usersResponse.data);
        
        // Preenche o formulário com os dados da tarefa
        form.setFieldsValue({
          title: taskResponse.data.title,
          description: taskResponse.data.description,
          status: taskResponse.data.status,
          user_id: taskResponse.data.user_id
        });

        setLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar dados da tarefa");
        console.error(error);
        setLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId, form]);

  const handleUpdateTask = async (values) => {
    try {
      await axios.put(`http://localhost:4000/api/task/${taskId}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Tarefa atualizada com sucesso!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Erro ao atualizar tarefa: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando dados da tarefa...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Tarefa</h1>
      
      <div className={styles.formContainer}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleUpdateTask}
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label={<span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px" }}>Título</span>}
            rules={[{ required: true, message: "Por favor, insira o título!" }]}
          >
            <Input 
              placeholder="Digite o título da tarefa" 
              size="large"
              style={{
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                padding: "12px 16px"
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px" }}>Descrição</span>}
            rules={[{ required: true, message: "Por favor, insira a descrição!" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Digite a descrição da tarefa"
              style={{
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                padding: "12px 16px"
              }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={<span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px" }}>Status</span>}
            rules={[{ required: true, message: "Por favor, selecione o status!" }]}
          >
            <Select 
              placeholder="Selecione o status"
              size="large"
              style={{
                borderRadius: "12px",
                fontSize: "16px"
              }}
            >
              <Option value="Pendente">Pendente</Option>
              <Option value="Em andamento">Em andamento</Option>
              <Option value="Concluído">Concluído</Option>
            </Select>
          </Form.Item>

          <div className={styles.buttonContainer}>
            <Button 
              className={styles.secondaryButton}
              onClick={() => router.push("/")}
            >
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className={styles.primaryButton}
            >
              Confirmar Edição
            </Button>
          </div>
        </Form>
      </div>
      
      <ToastContainer 
        position="top-right" 
        autoClose={4500}
        theme="light"
        style={{ zIndex: 10000 }}
      />
    </div>
  );
}