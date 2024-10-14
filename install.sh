bun build main.ts --target=bun --compile --outfile autoref
sudo mv autoref /usr/local/bin/
sudo ln -f oars.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable oars.service
sudo systemctl restart oars.service