import React from 'react';
import { Link } from '@remix-run/react';

import Icons from '$shared/ui/atoms/icons';

function Contact() {
  return (
    <div className="flex gap-2 w-max py-2 border-green-main">
      <Link
        target="_blank"
        to="https://www.linkedin.com/in/songjh97"
        aria-label="follow my linkedIn"
        rel="noreferrer"
      >
        <Icons.LinkedIn type="border" />
      </Link>
      <Link
        target="_blank"
        to="mailto:rfv1479@gmail.com?subject=[Blog Contact] "
        rel="noreferrer"
        aria-label="contact on email"
      >
        <Icons.Email type="border" />
      </Link>
      <Link
        target="_blank"
        to="https://www.github.com/wisesaturn"
        aria-label="follow my github"
        rel="noreferrer"
      >
        <Icons.Github type="border" />
      </Link>
      <Link
        target="_blank"
        to="https://www.instagram.com/songjh_97"
        aria-label="follow my instagram"
        rel="noreferrer"
      >
        <Icons.Instagram type="border" />
      </Link>
    </div>
  );
}

export default React.memo(Contact);
