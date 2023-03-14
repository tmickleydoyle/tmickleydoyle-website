import Image from 'next/image';
import Link from 'next/link'

import data from "../data/config.json";

const Profile = () => {
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
          {data.custom_contact_links && data.custom_contact_links.length > 0 && data.custom_contact_links.map((link, index) => (
            <div key={index}>
              <Link href={link.url}>{link.name}</Link>
            </div>
          ))}
        </div>
        <br />
        <hr width="40%" color="grey" size="2px" align="left" />
        <div className="greytext">
          <h1>Location</h1>
          <h2>{data.location}</h2>
          <br />
          <h1>Education</h1>
          <h2>{data.education}</h2>
          <br />
          <h1>Current</h1>
          <h2>Title: {data.current_role}</h2>
          <h2>Company: {data.current_company}</h2>
          <br />
          <h1>Previous</h1>
          {data.previous_roles && data.previous_roles.length > 0 && data.previous_roles.map((job, index) => (
            <div key={index}>
              <h2>Title: {job.role}</h2>
              <h2>Company: {job.company}</h2>
              <br />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Profile;