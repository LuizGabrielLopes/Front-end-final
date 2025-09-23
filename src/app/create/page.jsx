"use client";

import { Form, Input, Select, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

export default function Create() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users");
        setUsers(response.data);
      } catch {
        toast.error("Erro ao carregar usuários");
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
      router.push("/"); // Redireciona para a página inicial
    } catch (error) {
      toast.error("Erro ao criar tarefa: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Criar Nova Tarefa</h1>
      <Form form={form} layout="vertical" onFinish={handleCreateTask}>
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

        <Form.Item
          name="user_id"
          label="Responsável"
          rules={[{ required: true, message: "Por favor, selecione o responsável!" }]}
        >
          <Select placeholder="Selecione o responsável">
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Criar Tarefa
          </Button>
          <span style={{ marginLeft: "8px" }}></span>
          <Button type="primary" href="/"> Voltar </Button>
        </Form.Item>
      </Form>
    </div>
  );
}