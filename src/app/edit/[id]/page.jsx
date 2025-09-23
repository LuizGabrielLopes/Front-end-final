"use client";

import { Form, Input, Select, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      router.push("/");
    } catch (error) {
      toast.error("Erro ao atualizar tarefa: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Carregando...</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Editar Tarefa</h1>
      <Form form={form} layout="vertical" onFinish={handleUpdateTask}>
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "Por favor, insira o título!" }]}
        >
          <Input placeholder="Digite o título da tarefa" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: "Por favor, insira a descrição!" }]}
        >
          <TextArea rows={4} placeholder="Digite a descrição da tarefa" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Por favor, selecione o status!" }]}
        >
          <Select placeholder="Selecione o status">
            <Option value="Pendente">Pendente</Option>
            <Option value="Em andamento">Em andamento</Option>
            <Option value="Concluído">Concluído</Option>
          </Select>
        </Form.Item>

        

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Confirmar edição
          </Button>
          <span style={{ marginLeft: "8px" }}></span>
          <Button onClick={() => router.push("/")}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}