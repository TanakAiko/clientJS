# Utiliser une image de base légère pour Go
FROM golang:1.20-alpine

# Définir le répertoire de travail à l'intérieur du container
WORKDIR /app

# Copier le code source dans le répertoire de travail
COPY . .

# Installer GCC et autres dépendances nécessaires (si utilisé)
# RUN apk add --no-cache gcc musl-dev

# Construire l'application
RUN go build -o frontend-server

# Exposer le port
EXPOSE 8089

# Commande pour lancer le serveur
CMD ["./frontend-server"]
