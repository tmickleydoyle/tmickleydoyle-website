import React, { Component } from "react";


class Footer extends Component {
  render() {
    return (
      <footer>
          <div className="centertexts footer">
              <div>
              <span role="img" aria-label="star emoji">&#x2B50;&#xFE0F;</span> and <span role="img" aria-label="fork emoji">&#x1F374;</span> project on <a href="https://github.com/tmickleydoyle/hello-nextjs">GitHub</a>
              </div>
              <br />
          </div>
        </footer>
    );
  }
}

export default Footer;