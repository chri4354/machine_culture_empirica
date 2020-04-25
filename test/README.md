## Setup

### Get firefox
```
sudo apt-get install firefox
```

### Get geckodriver

https://github.com/mozilla/geckodriver/releases

```
mkdir -p ~/bin
cd ~/bin
wget https://github.com/mozilla/geckodriver/releases/download/v0.26.0/geckodriver-v0.26.0-linux64.tar.gz
tar xvzf geckodriver-v0.26.0-linux64.tar.gz
```

### add bin to path

```
echo "export PATH=\$PATH:~/bin" >> ~/.bashrc
```

### install env

```
sudo apt-get update
sudo apt install build-essential
sudo apt-get install python3-dev
sudo apt-get install python3-venv
```

```
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

### run 

```
python load_test.py --jobs=5 --player=40
```
