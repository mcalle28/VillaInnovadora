cd /home/ec2-user
cd VillaInnovadora
git checkout Desarrollo
git pull
sudo service docker start
docker-compose build
docker-compose up

