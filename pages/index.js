import Image from 'next/image'

function HomePage() {
  return<div className="maincontainer">
      <style jsx>{`
        .maincontainer {
          margin: 100px;
        }
        .greytext {
          color: #808080;
        }
      `}</style>
      <div style={{borderRadius: '50%', overflow: 'hidden', width: '250px', height: '250px' }}>
        <Image 
          src="/static/images/profile_image.png" 
          width={250}
          height={250} 
          alt="Profile Image" />
      </div>
      <br />
      <h1>Thomas Mickley-Doyle</h1>
      <br />
      <hr  style={{
        color: '#808080',
        backgroundColor: '#808080',
        height: .5,
        borderColor : '#808080'
      }}/>
      <div className="greytext">
        <h1>Location</h1>
        <h2>New Orleans, Louisiana, USA - Remote</h2>
        <br />
        <h1>Education</h1>
        <h2>M.S. Predictive Analytics, Norwestern University</h2>
        <br />
        <h1>Current</h1>
        <h2>Title: Staff Engineer, Analytics</h2>
        <h2>Company: ▲ Vercel</h2>
        <br />
        <h1>Previous</h1>
        <h2>Title: Senior Software Engineer, Data</h2>
        <h2>Company: GitHub</h2>
        <br />
        <h2>Title: Data Scientist, Engineering</h2>
        <h2>Company: Lucid</h2>
      </div>
    </div>
}

export default HomePage