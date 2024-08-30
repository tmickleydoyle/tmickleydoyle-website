import data from "../data/config.json";

const Resume = () => {
  return (
    <>
      <div className="greytext">
        <h1>Location</h1>
        <h2>{data.location}</h2>
        <br />

        <h1>Current</h1>
        {data.current_roles && data.current_roles.length > 0 && data.current_roles.map((job, index) => (
          <div key={index}>
            <h2>{job.role}</h2>
            <h3>{job.company}</h3>
            {job.summary && <p>{job.summary}</p>}
            <br />
          </div>
        ))}
        <br />

        {data.previous_roles && data.previous_roles.length > 0 && (
          <h1>Previous</h1>
        )}
        {data.previous_roles && data.previous_roles.length > 0 && data.previous_roles.map((job, index) => (
          <div key={index}>
            <h2>{job.role}</h2>
            <h3>{job.company}</h3>
            {job.summary && <p>{job.summary}</p>}
            <br />
          </div>
        ))}
        <br />

        {data.education && data.education.length > 0 && (
          <h1>Education</h1>
        )}
        {data.education && data.education.length > 0 && data.education.map((edu, index) => (
          <div key={index}>
            <h2>{edu.degree}</h2>
            <h3>{edu.school}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default Resume;
