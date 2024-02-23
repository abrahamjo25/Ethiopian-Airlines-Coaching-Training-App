import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { Link, Element } from "react-scroll";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { getData } from "../../services/AccessAPI";
import { HasRoles } from "../../services/RoleServices";

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const ToggleButton = styled.button`
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: #2e7d32;
        color: #fff;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }
`;

const Sidebar = styled(animated.div)`
    width: 250px;
    height: calc(100vh - 40px);
    margin-top: 20px;
    background-color: #f0f0f0;
    padding: 20px;
    overflow-y: auto;

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: ${(props) => (props.visible ? "0" : "-250px")};
        z-index: 999;
        transition: left 0.3s ease;
    }
`;
const Content = styled.div`
    flex: 1;
    padding: 20px;
    margin-top: 50px;
`;

const Section = styled.div`
    margin-bottom: 40px;
    margin-left: 60px;
`;

const CreateNewButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #2e7d32;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
`;

const LinkText = styled(Link)`
    display: block;
    color: #000;
    font-size: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
        color: #61dafb;
    }
`;

const DocumentationPage = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarData, setSidebarData] = useState([]);

    const [selectedSection, setSelectedSection] = useState(null);
    const history = useHistory();
    useEffect(() => {
        fetchSidebarData().then((data) => {
            setSidebarData(data?.data);
        });
    }, []);

    const sidebarProps = useSpring({
        left: sidebarVisible ? 0 : -250,
    });

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const createNew = () => {
        history.push("/create-documentation");
    };

    const fetchSidebarData = async () => {
        let res = await getData("/Documentation/GetAll", "Documentation-View");
        return res;
    };

    const handleSidebarItemClick = (section) => {
        setSelectedSection(section);
        toggleSidebar();
    };
    const editContent = (data) => {
        history.push({
            pathname: "/create-documentation",
            state: { data: data },
        });
    };
    return (
        <Container>
            <ToggleButton onClick={toggleSidebar}>
                <i className="pi pi-align-justify"></i>
            </ToggleButton>

            <Sidebar style={sidebarProps} visible={sidebarVisible}>
                <ul>
                    {sidebarData.map((item) => (
                        <li key={item.id}>
                            <LinkText to={`section${item.id}`} smooth={true} duration={500} onClick={() => handleSidebarItemClick(item)}>
                                {item.title}
                            </LinkText>
                        </li>
                    ))}
                </ul>
            </Sidebar>

            <Content>
                {HasRoles("Documentation-Create") && (
                    <CreateNewButton onClick={createNew}>
                        <i className="pi pi-plus"></i> Create New
                    </CreateNewButton>
                )}

                {selectedSection ? (
                    <Section>
                        <h2>
                            {selectedSection.title} {HasRoles("Documentation-Create") && <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-outlined" onClick={(e) => editContent(selectedSection)} />}
                        </h2>
                        <div dangerouslySetInnerHTML={{ __html: selectedSection.content }} />
                    </Section>
                ) : (
                    <div>
                        <Element name="section1">
                            <Section>
                                <h2>Getting Started</h2>
                                <p>This is where you provide information on getting started.</p>
                            </Section>
                        </Element>
                    </div>
                )}
            </Content>
        </Container>
    );
};

export default DocumentationPage;
