package main

import (
	"fmt"
	"net/http"
	"text/template"
)

/*
type Request struct {
	SessionID string `json:"sessionID"`
} */

func home(w http.ResponseWriter, r *http.Request) {
	/*
		fmt.Println("\nTest session !!!!!!!!!!!!!!!!!!!!!!!")

		cookie, err := r.Cookie("sessionID")
		if err != nil {
			w.Write([]byte("Redirect to login page"))
		}

		reqq := Request{
			SessionID: cookie.Value,
		}
		jsonData, err := json.Marshal(reqq)
		if err != nil {
			http.Error(w, "Internal server error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		req, err := http.NewRequest("POST", "http://localhost:8081/authorized", bytes.NewBuffer(jsonData))
		if err != nil {
			http.Error(w, "Internal server error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		req.Header.Set("Content-Type", "application/json")

		client := http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Internal server error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		responseBody, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Internal server error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Printf("body: %v, status: %v", responseBody, resp.StatusCode)
	*/
	if r.URL.Path != "/" {
		http.Error(w, "Page not found", http.StatusNotFound)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Not allowed", http.StatusMethodNotAllowed)
		return
	}

	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal error server", http.StatusInternalServerError)
		return
	}

	err = tmpl.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal error server", http.StatusInternalServerError)
		return
	}

}

func main() {
	http.HandleFunc("/", home)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	fmt.Println("WebSocket server starting on port http://localhost:8089")
	if err := http.ListenAndServe(":8089", nil); err != nil {
		fmt.Println(err)
	}
}
