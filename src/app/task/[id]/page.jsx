"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { 
  Button, 
  Descriptions,
  Tag,
  Skeleton,
  Card
} from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./task.module.css";

export default function TaskDetails() {
  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const [taskResponse, usersResponse] = await Promise.all([
        axios.get(`http://localhost:4000/api/task/${id}`),
        axios.get("http://localhost:4000/api/users"),
      ]);

      setTask(taskResponse.data);
      
      // Encontrar o usuário responsável pela tarefa
      const responsibleUser = usersResponse.data.find(
        user => user.id === taskResponse.data.user_id
      );
      setUser(responsibleUser);
      
    } catch (error) {
      console.error("Erro ao buscar detalhes da tarefa:", error);
      toast.error("Erro ao carregar detalhes da tarefa!");
      router.push("/"); // Redireciona para a página principal em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/task/${id}`);
      toast.success("Tarefa excluída com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao excluir tarefa!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pendente": return "red";
      case "Em andamento": return "orange";
      case "Concluído": return "green";
      default: return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'red';
      case 'Média': return 'orange';
      case 'Baixa': return 'green';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button 
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/")}
            size="large"
          >
            Voltar
          </Button>
        </div>
        <Card className={styles.card}>
          <Skeleton active />
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button 
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/")}
            size="large"
          >
            Voltar
          </Button>
        </div>
        <Card className={styles.card}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h2>Tarefa não encontrada</h2>
            <p>A tarefa solicitada não existe ou foi removida.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          size="large"
          style={{
            borderRadius: "8px",
            height: "45px",
            fontSize: "16px",
            fontWeight: "500"
          }}
        >
          Voltar
        </Button>
        
        <div className={styles.actions}>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/edit/${task.id}`)}
            size="large"
            style={{
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              border: "none",
              borderRadius: "8px",
              height: "45px",
              fontSize: "16px",
              fontWeight: "500"
            }}
          >
            Editar
          </Button>
          
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            size="large"
            style={{
              borderRadius: "8px",
              height: "45px",
              fontSize: "16px",
              fontWeight: "500"
            }}
          >
            Excluir
          </Button>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.taskHeader}>
          <h1 className={styles.taskTitle}>{task.title}</h1>
          <div className={styles.taskMeta}>
            <span className={styles.taskId}>#{task.id}</span>
          </div>
        </div>

        <Descriptions 
          bordered 
          column={1}
          className={styles.descriptions}
          styles={{ 
            label: {
              fontWeight: "600", 
              color: "#1e40af",
              backgroundColor: "rgba(219, 234, 254, 0.5)",
              width: "150px"
            },
            content: {
              backgroundColor: "white",
              padding: "16px"
            }
          }}
        >
          <Descriptions.Item label="Descrição">
            <div className={styles.description}>
              {task.description}
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            <Tag 
              color={getStatusColor(task.status)}
              className={styles.statusTag}
            >
              {task.status}
            </Tag>
          </Descriptions.Item>
          
          {task.priority && (
            <Descriptions.Item label="Prioridade">
              <Tag 
                color={getPriorityColor(task.priority)}
                className={styles.priorityTag}
              >
                {task.priority}
              </Tag>
            </Descriptions.Item>
          )}
          
          <Descriptions.Item label="Responsável">
            <div className={styles.responsible}>
              {user ? user.name : 'Usuário não encontrado'}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}