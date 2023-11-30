import React from 'react';

import { TWstyleIconWrapper } from '@styles/config';

import IconLinkedIn from '@components/Assets/IconLinkedIn';
import IconEmail from '@components/Assets/IconEmail';
import IconGithub from '@components/Assets/IconGithub';
import IconInstagram from '@components/Assets/IconInstagram';

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
          <IconLinkedIn />
        </a>
      </span>
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="mailto:rfv1479@gmail.com?subject=[Blog Contact] "
          rel="noreferrer"
          aria-label="contact on email"
        >
          <IconEmail />
        </a>
      </span>
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="https://www.github.com/wisesaturn"
          aria-label="follow my github"
          rel="noreferrer"
        >
          <IconGithub />
        </a>
      </span>
      <span className={TWstyleIconWrapper}>
        <a
          target="_blank"
          href="https://www.instagram.com/songjh_97"
          aria-label="follow my instagram"
          rel="noreferrer"
        >
          <IconInstagram />
        </a>
      </span>
    </div>
  );
}

export default React.memo(Contact);
