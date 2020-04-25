"""Usage: load_test.py --player=<player> --jobs=<jobs>

Runs the reward network game with a headless browser
"""


from docopt import docopt
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys
import time
import random
import datetime
import multiprocessing


def get_url(url):
    options = Options()
    options.headless = True
    driver = webdriver.Firefox(options=options)
    driver.get(url)
    driver.implicitly_wait(10) # seconds
    return driver

def start_game(driver):
    # accept aggreement
    driver.find_element_by_class_name("bp3-intent-success").click()

    # go through intro
    for i in range(7):
        driver.find_element_by_xpath('//button[text()="Next"]').click()

    # fill out questionaer
    question_groups = driver.find_elements_by_class_name('question-group')
    answers = ['false', 'true', 'false', 'true']
    for qg, answer in zip(question_groups, answers):
        qg.find_element_by_xpath(f'.//input[@value="{answer}"]').click()

    # submit
    driver.find_element_by_xpath('//button[text()="Submit"]').click()


def random_play(driver, player_name):
    counter = 1
    while True:
        try:
            xpath = "//h1[text()='Play yourself']"
            driver.find_element_by_xpath(xpath)
            if counter > 0:
                r = driver.find_element_by_xpath('//a[@tabindex="0"]').text
                print(f'[{player_name}] Started {r}')
        except:
            if counter > 10:
                print(f'[{player_name}] Got stucked')
                raise NameError('Got stucked.')
            counter += 1
            try:
                driver.find_element_by_class_name('exit-survey')
            except:
                continue
            break
        counter = 0
        try:
            node = random.choice('ABCDEF')
            xpath = f"//*[name()='svg']//*[name()='g']//*[name()='g']//*[text()='{node}']"
            driver.find_element_by_xpath(xpath).click()
        except:
            pass


def fill_out_survey(driver):
    driver.find_element_by_id('question1').send_keys("All Fine!")
    xpath = "//button[text()='Submit']"
    driver.find_element_by_xpath(xpath).click()


def test_run(player_name):
    for i in range(10):
        try:
            pid = datetime.datetime.now().isoformat()
            driver = get_url(f"http://3.127.208.75/?PROLIFIC_PID={pid}")
        except:
            print(f'[{player_name}] Failed getting driver')
            time.sleep(5)
            continue
        try:
            print(f'[{player_name}] Start intro')
            start_game(driver)
            print(f'[{player_name}] Start game loop')
            random_play(driver, player_name)
            print(f'[{player_name}] Fill out survey')
            fill_out_survey(driver)
            print(f'[{player_name}] Quit')
        except:
            print(f'[{player_name}] Unexpected Error')
        finally:
            driver.quit()
            break


def main(player, jobs):
    pool = multiprocessing.Pool(int(jobs))
    pool.map(test_run, range(0, int(player)))


if __name__ == "__main__":
    arguments = docopt(__doc__)
    arguments = {k[2:]: v for k, v in arguments.items()}
    main(**arguments)
