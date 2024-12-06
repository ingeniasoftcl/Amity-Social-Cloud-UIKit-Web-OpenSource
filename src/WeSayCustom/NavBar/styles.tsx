import styled from 'styled-components';

export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  background-color: #190c64;
  color: #ffffff;
  border-radius: 0 0 50px 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  a {
    color: #ffffff;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color: #ff6b6b;
    }
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 1rem;

  button,
  a {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #ff6b6b;
    }
  }

  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const NavbarLogo = styled.img`
  height: 72px;
  width: auto;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;

  input {
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: #333;
  }

  button {
    background: none;
    border: none;
    color: #0a1f63;
    font-weight: bold;
    cursor: pointer;
  }
`;
