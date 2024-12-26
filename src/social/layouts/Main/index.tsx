import React, { useState } from 'react';
import styled from 'styled-components';

import Navbar from '~/WeSayCustom/NavBar';
import FooterWeSay from '~/WeSayCustom/Footer';

const Container = styled.div`
  display: grid;
  grid-template-areas:
    'header'
    'content'
    'footer';
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  height: 100vh;
  width: 100%;
`;

const Header = styled.header`
  grid-area: header;
`;

const Content = styled.main`
  grid-area: content;
  overflow-y: auto;
`;

const Footer = styled.footer`
  grid-area: footer;
`;
interface LayoutProps {
  children: React.ReactNode;
  onViewChange?: (newView: 'home' | 'chat') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onViewChange }) => {
  const [view, setView] = useState<'home' | 'chat'>('home');

  const handleViewChange = (newView: 'home' | 'chat') => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };
  return (
    <Container>
      <Header>
        <Navbar view={view} setView={setView} onViewChange={handleViewChange} />
      </Header>
      <Content>{children}</Content>
      <Footer>
        <FooterWeSay />
      </Footer>
    </Container>
  );
};

export default Layout;
