"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton } from "antd";
import { ToastContainer, toast } from "react-toastify";
import styles from "./page.module.css";

export default function Tarefas() {
  const [data, setData] = useState({
    tarefas: [],
    users: [],
    loading: true,
    current: 1,
    pageSize: 5,
  });

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    tarefa: null,
    user: null,
    loading: false,
  });

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const [tarefasResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/task"),
          axios.get("http://localhost:4000/api/users")
        ]);
        
        setData({ 
          tarefas: tarefasResponse.data, 
          users: usersResponse.data,
          loading: false, 
          current: 1, 
          pageSize: 5 
        });
      } catch {
        toast.error("Erro ao carregar tarefas");
        setData((d) => ({ ...d, loading: false }));
      }
    };

    fetchTarefas();
  }, []);

  const openModal = async (tarefa) => {
    const user = data.users.find(u => u.id === tarefa.user_id);
    setModalInfo({ visible: true, tarefa, user, loading: false });
  };

  const paginatedTarefas = () => {
    const start = (data.current - 1) * data.pageSize;
    return data.tarefas.slice(start, start + data.pageSize);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Lista de Tarefas</h1>
      </div>

      <Pagination
        current={data.current}
        pageSize={data.pageSize}
        total={data.tarefas.length}
        onChange={(page, size) =>
          setData((d) => ({ ...d, current: page, pageSize: size }))
        }
        showSizeChanger
        pageSizeOptions={["5", "10", "50"]}
      />

      {data.loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Skeleton active />
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {paginatedTarefas().map((tarefa) => {
            const user = data.users.find(u => u.id === tarefa.user_id);
            return (
              <Card
                key={tarefa.id}
                className={styles.card}
                hoverable
                onClick={() => openModal(tarefa)}
                title={tarefa.title}
              >
                <p><strong>Status:</strong> {tarefa.status}</p>
                <p><strong>Descrição:</strong> {tarefa.description.substring(0, 80)}...</p>
                <p><strong>Responsável:</strong> {user?.name || 'Usuário não encontrado'}</p>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        title={`Tarefa: ${modalInfo.tarefa?.title}`}
        open={modalInfo.visible}
        onCancel={() =>
          setModalInfo({
            visible: false,
            tarefa: null,
            user: null,
            loading: false,
          })
        }
        onOk={() =>
          setModalInfo({
            visible: false,
            tarefa: null,
            user: null,
            loading: false,
          })
        }
        width={600}
      >
        {modalInfo.loading ? (
          <Skeleton active />
        ) : modalInfo.tarefa ? (
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>ID:</span>{" "}
              {modalInfo.tarefa.id}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Título:</span>{" "}
              {modalInfo.tarefa.title}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Descrição:</span>{" "}
              {modalInfo.tarefa.description}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Status:</span>{" "}
              {modalInfo.tarefa.status}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Responsável:</span>{" "}
              {modalInfo.user?.name || 'Usuário não encontrado'}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
              {modalInfo.user?.email || 'Email não encontrado'}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Tarefa não encontrada.</p>
        )}
      </Modal>

      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}