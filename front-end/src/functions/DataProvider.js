class DataProvider {
  static async check_login_status() {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URI}/auth/login_status`; // Replace with your API endpoint
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
    const apiUrl = `${import.meta.env.VITE_BACKEND_URI}/auth/login`;
    const requestData = {
      username: username,
      password: password,
    };
    console.log(requestData); // Replace with your API endpoint
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
    const apiUrl = `${import.meta.env.VITE_BACKEND_URI}/auth/sign_up`;
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
      } else if (response.status === 406) {
        return "account exists already";
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  static async logout() {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URI}/auth/logout`;

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

  static fetch_conversation_data() {
    return [{ language: "English", title: "alle jahre wieder", id: "3" }];
    fetch("/user_data/conversations")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return;
      });
  }

  static fetch_available_languages() {
    return ["English", "Ruski", "German"];
    fetch("/languages/available")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return;
      });
  }

  static create_conversation() {}

  static delete_conversation() {}

  static update_conversation_title() {}

  static update_conversation_picture() {}
}

export default DataProvider;
