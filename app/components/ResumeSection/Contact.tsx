import { AiFillLinkedin, AiFillInstagram, AiFillMail, AiFillGithub } from 'react-icons/ai';
import React from 'react';

import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

function Contact() {
  return (
    <div className="flex gap-2 w-max py-2 border-green-main">
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/songjh97"
          aria-label="follow my github"
          rel="noreferrer"
        >
          <AiFillLinkedin className={TWstyleIcon} size="2rem" />
        </a>
      </span>
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="mailto:rfv1479@gmail.com?subject=[Blog Contact] "
          rel="noreferrer"
          aria-label="contact on email"
        >
          <AiFillMail className={TWstyleIcon} size="2rem" />
        </a>
      </span>
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="https://www.github.com/wisesaturn"
          aria-label="follow my github"
          rel="noreferrer"
        >
          <AiFillGithub className={TWstyleIcon} size="2rem" />
        </a>
      </span>
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="https://www.instagram.com/songjh_97"
          aria-label="follow my instagram"
          rel="noreferrer"
        >
          <AiFillInstagram className={TWstyleIcon} size="2rem" />
        </a>
      </span>
    </div>
  );
}

export default React.memo(Contact);
