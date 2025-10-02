"use client";

import { Form, Input, Select, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./create.module.css";

const { TextArea } = Input;
const { Option } = Select;

export default function Create() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users");
        setUsers(response.data);
        setLoading(false);
      } catch {
        toast.error("Erro ao carregar usuários");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateTask = async (values) => {
    try {
      const response = await axios.post("http://localhost:4000/api/task", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Tarefa criada com sucesso!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Erro ao criar tarefa: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Nova Tarefa</h1>
      
      <div className={styles.formContainer}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleCreateTask}
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

          <Form.Item
            name="user_id"
            label={<span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px" }}>Responsável</span>}
            rules={[{ required: true, message: "Por favor, selecione o responsável!" }]}
          >
            <Select 
              placeholder="Selecione o responsável"
              size="large"
              style={{
                borderRadius: "12px",
                fontSize: "16px"
              }}
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
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
              Criar Tarefa
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