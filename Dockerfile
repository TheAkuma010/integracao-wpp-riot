# Dockerfile

# Use uma imagem que contenha Node.js e Python
FROM node:14

# Instalar Python e pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências para o contêiner
COPY package.json requirements.txt ./

# Instalar dependências do Node.js
RUN npm install

# Instalar dependências do Python
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar o restante dos arquivos do projeto para o contêiner
COPY . .

# Expor as portas necessárias
EXPOSE 5000
EXPOSE 3000

# Comando para iniciar ambos os servidores Node.js e Flask
CMD ["sh", "-c", "node whatsapp.js & python3 app.py"]
