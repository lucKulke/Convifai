class DataProvider {
  static async global_authentication_status() {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/global_authentication_status`;
    try {
      const response = await fetch(apiUrl, {
        credentials: "include",
      });

      if (response.status === 200) {
        return true;
      } else if (response.status === 401) {
        return false;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async global_authentication(password) {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/global_authentication`;
    const requestData = new URLSearchParams();
    requestData.append("password", password);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestData,
      });

      if (response.status === 200) {
        return true;
      } else if (response.status === 401) {
        return false;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async check_login_status() {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/login_status`; // Replace with your API endpoint
    try {
      const response = await fetch(apiUrl, {
        credentials: "include",
      });

      if (response.status === 200) {
        return true;
      } else if (response.status === 204) {
        return false;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async login(username, password) {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
    const requestData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      if (response.status === 201) {
        return true;
      } else if (response.status === 423) {
        return "wrong password";
      } else if (response.status === 406) {
        return "no registerd account";
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async sign_up(username, password) {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/sign_up`;
    const requestData = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      if (response.status === 201) {
        return 201;
      } else if (response.status === 406) {
        const responseText = await response.text();
        return responseText;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async logout() {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/logout`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 201) {
        return true;
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async fetch_conversations_data() {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/user_data/conversations`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();

        return data;
      }
      if (response.status === 201) {
        return [];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async fetch_available_languages() {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/ai_routes/available_languages`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();

        return data;
      }
      if (response.status === 201) {
        return [];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async create_conversation(language, title, picture) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/user_data/conversations/add`;
    const requestData = {
      language: language,
      title: title,
      picture: picture,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      if (response.status === 201) {
        const data = await response.json();
        return data["id"];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async delete_conversation(conversation_id) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/user_data/conversations/delete`;
    const requestData = { id: conversation_id };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      if (response.status === 201) {
        return true;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async fetch_conversation_data(conversation_id) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/user_data/conversation/${conversation_id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async update_conversation_title(conversation_id) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/ai_routes/summarise_conversation`;
    const requestData = { conversation_id: conversation_id };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        const data = await response.json();

        return data.new_title;
      }
      if (response.status === 201) {
        return [];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async update_conversation_picture(conversation_id) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/ai_routes/generate_image`;
    const requestData = { conversation_id: conversation_id };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        const data = await response.json();

        return data.picture_name;
      }
      if (response.status === 201) {
        return [];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async text_to_voice(text, language) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/ai_routes/text_to_voice`;
    const requestData = { text: text, language: language };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;
      }
      if (response.status === 201) {
        return [];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async voice_to_text(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/ai_routes/voice_to_text`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.status === 200) {
        const text = await response.text();
        return text;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async language_processing(textFromUser, language, id) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/ai_routes/language_processing`;
    const requestData = {
      text: textFromUser,
      conversation_id: id,
      language: language,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        const data = await response.json();
        return {
          interlocutor: data.interlocutor.content.trimStart().trimEnd(),
          corrector: data.corrector.content.trimStart().trimEnd(),
        };
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async save_iteration_data(iterationData, conversation_id) {
    const apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/user_data/iteration_end`;
    iterationData.conversation_id = conversation_id;
    const requestData = iterationData;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        return true;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
}

export default DataProvider;
