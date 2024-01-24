function About(props) {
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-2/3 mt-11">
          <ul className="space-y-10 mb-10">
            <li>
              <div className="ml-1">
                <h2 className="navbarLink">About Me</h2>
                <p>
                  Hi, I'm Lucas, a passionate junior developer. This is my
                  personal project, and I'm excited to share it with you! Hi,
                  I'm Lucas, a junior developer passionate about building web
                  applications. I created this project to learn more about the
                  React.js and Flask frameworks, which I used to build this
                  application. I'm excited to share it with you!
                </p>
                <h3 className="text-bold mt-3 mb-1">Links to my:</h3>
                <ul className="ml-2 text-blue-400">
                  <li>
                    <a href="https://www.linkedin.com/in/lucas-kulke-36b9852a8">
                      <u>LinkedIn</u>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.github.com/lucKulke">
                      <u>GitHub</u>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div className="ml-1">
                <h2 className="navbarLink">Project</h2>
                <p>
                  Convifai is an AI-driven voice dialogue webapp utilizing
                  speech recognition, language processing and voice generation
                  ai models, for a seamless, voice-based conversation. The goal
                  is that people who simply want to improve their speaking of a
                  particular language can have a conversation with a language
                  processing model such as Chat-GPT before speaking to real
                  people.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default About;
