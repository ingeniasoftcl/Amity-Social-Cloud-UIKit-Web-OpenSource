import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #190c64;
  color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.2);
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    text-align: left;
  }

  img {
    height: 48px;
    margin-right: 15px;
  }

  p {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: white;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    justify-content: flex-start;
    margin-bottom: 0;
  }

  a {
    font-size: 0.875rem;
    text-transform: uppercase;
    color: white;
    text-decoration: none;
    letter-spacing: 1px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FooterRight = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: right;
  }

  p {
    font-size: 0.875rem;

    span {
      color: red;
    }

    a {
      font-weight: bold;
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
