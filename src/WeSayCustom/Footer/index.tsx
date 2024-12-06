import React from 'react';
import { FooterContainer, FooterContent, FooterLeft, FooterLinks, FooterRight } from './styles';

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLeft>
          <img
            src="https://s3.us-east-1.amazonaws.com/we-say.com-assets/social-plus-wrap/WeSay_Logo_White.svg"
            alt="Logo"
          />
          <p>All rights reserved</p>
        </FooterLeft>
        <FooterLinks>
          <a href="/">Terms of Service</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Cookie Policy</a>
          <a href="/">Accessibility</a>
        </FooterLinks>
        <FooterRight>
          <p>
            Powered with <span>❤️</span> by{' '}
            <a href="https://oaktheory.com" target="_blank" rel="noopener noreferrer">
              Oak Theory
            </a>
          </p>
        </FooterRight>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
