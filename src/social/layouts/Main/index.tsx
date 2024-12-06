import React from 'react';
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <Header>
        <Navbar />
      </Header>
      <Content>{children}</Content>
      <Footer>
        <FooterWeSay />
      </Footer>
    </Container>
  );
};

export default Layout;
