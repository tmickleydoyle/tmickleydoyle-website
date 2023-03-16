import Image from 'next/image';
import Link from 'next/link'

import { useState } from 'react';

import data from "../data/config.json";
import Contributions from './Contributions';
import Resume from './Resume';

const Profile = () => {
  const [tab, setTab] = useState('profile');

  const handleClick = (param) => {
    setTab(param);
  }

  return(
    <>
      <div className="maincontainer">
        <div className='photoborder'>
          <Image 
            src={data.profile_photo}
            width={250}
            height={250} 
            alt="Profile Image" />
        </div>
        <br />
        <h1>{data.name}</h1>
        <div className="greytext">
          <a>&nbsp;</a>
          {data.custom_contact_links && data.custom_contact_links.length > 0 && data.custom_contact_links.map((link, index) => (
              <a><Link key={index} href={link.url}>{link.name}</Link> {index !== data.custom_contact_links.length - 1 && ' | '} </a>
          ))}
        </div>
        <br />
        <hr width="40%" color="grey" size="2px" align="left" />
        <br />
        <button className='customButton' onClick={() => handleClick("profile")}>Profile</button>
        <a>|</a>
        <button className='customButton' onClick={() => handleClick("commits")}>GitHub Contributions Bar Chart</button>
        <br />
        {tab === 'profile' && (
          <Resume />
        )}
        {tab === 'commits' && (
          <div>
            <Contributions />
          </div>
        )}
      </div>
    </>
  )
}

export default Profile;