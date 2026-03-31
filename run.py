import socket
import uvicorn
import os
import sys

def get_available_port(start_port=8000, max_tries=100):
    """
    Search for an available port starting from start_port up to start_port + max_tries.
    """
    for port in range(start_port, start_port + max_tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                # Set SO_REUSEADDR to check if the port is truly available
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(("0.0.0.0", port))
                return port
            except socket.error:
                print(f"Port {port} is busy, trying next...")
                continue
    raise RuntimeError(f"Could not find an available port in range {start_port}-{start_port + max_tries}")

if __name__ == "__main__":
    # Check if PORT environment variable is set (used by platforms like Railway)
    # If it is, use it directly (as it's assigned by the platform)
    # Otherwise, use the port selection logic for local development
    env_port = os.getenv("PORT")
    
    if env_port:
        port = int(env_port)
        print(f"Using platform-assigned port: {port}")
    else:
        # Default starting port 8000
        port = get_available_port(8000)
        print(f"Autoselected port: {port}")

    # Set host to 0.0.0.0 for external access (required for Docker/Railway)
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True if not env_port else False)
