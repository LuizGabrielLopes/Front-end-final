"use client";

import { Button } from "antd";
import { ArrowLeftOutlined, UserOutlined, CodeOutlined, BookOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./about.module.css";

export default function About() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sobre Mim</h1>
            
            <div className={styles.cardContainer}>
                <div className={styles.textContainer}>
                    <h1 className={styles.cardTitle}>
                        <UserOutlined style={{ marginRight: "12px" }} />
                        Luiz Gabriel Lopes Carvalho
                    </h1>
                    
                    <ul className={styles.infoList}>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Turma:</span> 2TDS1
                        </li>
                        <li>
                            <span className={styles.infoLabel}>Instrutores:</span> Felipe Santos e Felipe Mamprim
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Matéria:</span> Projetos
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Atividade:</span> Avaliação de Projetos
                        </li>
                    </ul>
                    
                    <div className={styles.description}>
                        <p>
                            <BookOutlined style={{ marginRight: "8px" }} />
                            Esta é minha atividade avaliativa para a matéria de Projetos, desenvolvida 
                            com o objetivo de criar uma aplicação web completa (front-end + back-end) 
                            demonstrando os conhecimentos adquiridos durante o curso. O projeto implementa 
                            um sistema de gerenciamento de tarefas com interface moderna e responsiva.
                        </p>
                    </div>
                    
                    <div className={styles.description}>
                        <p>
                            <CodeOutlined style={{ marginRight: "8px" }} />
                            A aplicação integra tecnologias front-end (Next.js, React) com back-end 
                            (API RESTful), permitindo operações completas de CRUD, sistema de usuários, 
                            priorização de tarefas e interface intuitiva. O projeto demonstra competências 
                            em desenvolvimento full-stack e boas práticas de engenharia de software.
                        </p>
                    </div>
                </div>
                
                <Button 
                    type="primary"
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/")}
                    className={styles.actionButton}
                >
                    Voltar ao Gerenciador
                </Button>
            </div>
        </div>
    );
}