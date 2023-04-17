import data from "../data/config.json";

const Resume = () => {
  return(
    <>
        <div className="greytext">
            <h1>Location</h1>
            <h2>{data.location}</h2>
            <br />
            {data.education && data.education.length > 0 && (
            <h1>Education</h1>
            )}
            {data.education && data.education.length > 0 && data.education.map((edu, index) => (
            <div key={index}>
                <h2>{edu.degree}, {edu.school}</h2>
            </div>
            ))}
            <br />
            <h1>Current</h1>
            <h2>{data.current_role}</h2>
            <h2>{data.current_company}</h2>
            <br />
            {data.previous_roles && data.previous_roles.length > 0 && (
            <h1>Previous</h1>
            )}
            {data.previous_roles && data.previous_roles.length > 0 && data.previous_roles.map((job, index) => (
            <div key={index}>
                <h2>{job.role}</h2>
                <h2>{job.company}</h2>
                <br />
            </div>
            ))}
        </div>
    </>
  )
}

export default Resume;