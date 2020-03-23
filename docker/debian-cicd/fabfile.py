from fabric import Connection, Config #, task
from invoke import Collection, task
import paramiko
import io
import os
import sys

# TODO tasks
# 4. make backup
# 5. restore backup

class cicd:
    def __init__(*args, **kwargs):
        # print(kwargs)
        pass

    def get_context(self):
        pass

    @task
    def deploy(self):
        print('Deploy')

def get_base_path():
    if os.environ.get('DOCKER_CICD') == '1':
        return '/home/foroffice/docker'
    else:
        return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

BASE_PATH = DOCKER_DIR = get_base_path()
SITE_DIR = os.path.join(BASE_PATH, 'www')

def msg(msg):
    print('=== {} ==='.format(msg))

def run(c, command, cd_path=None):
    try:
        if cd_path:
            c.cd(cd_path)

        c.run(command)
    except Exception as e:
        print('Run "{}" except: {}'.format(command, e))

# Git
@task
def git_pull(c):
    msg('Git pull')
    with c.cd(SITE_DIR):
        c.run('git pull origin master')

# Docker
@task
def docker_pull(c):
    with c.cd(DOCKER_DIR):
        c.run('git pull origin master')

@task
def docker_build(c):
    with c.cd(DOCKER_DIR):
        c.run('docker-compose build')

@task
def docker_up(c):
    c.run('docker-compose up nginx')

@task
def docker_cicd_build(c):
    c.run('docker build ./docker/debian-cicd -t crank/foroffice-debian-cicd')

@task
def docker_cicd_push(c):
    # c.run('docker login')
    c.run('docker push crank/foroffice-debian-cicd')

@task
def docker_up(c):
    with c.cd(DOCKER_DIR):
        c.run('docker-compose up -d nginx')

@task
def docker_deploy(c):
    docker_pull(c)
    docker_build(c)
    docker_up(c)

# DB
@task
def db_backup(c):
    print('DB make backup')

@task
def db_restore(c):
    print('DB restore backup')

# Assets
def assets_yarn(c):
    msg('Yarn')
    with c.cd(DOCKER_DIR):
        c.run('docker-compose run --rm node yarn')

def assets_build(c):
    msg('Assets build')
    with c.cd(DOCKER_DIR):
        c.run('docker-compose run --rm node yarn build')

# Site
@task
def composer_install(c):
    msg('Composer install')
    with c.cd(DOCKER_DIR):
        c.run('docker-compose exec apache php local/composer/composer.phar install')

@task
def deploy(c):
    msg('Deploy site')
    # print(c.__dict__)
    # print(c.keys())
    git_pull(c)
    # composer_install(c)
    assets_yarn(c)
    # assets_build(c)

    # TODO assets_build earses entrypoints.js file

def get_key_str():
    if os.environ.get('SSH_PRIVATE_KEY'):
        return os.environ['SSH_PRIVATE_KEY']
    elif os.path.exists('/root/.ssh/id_rsa'):
        return open('/root/.ssh/id_rsa', 'r').read()
    else:
        path = os.path.join(os.path.expanduser('~'), '.ssh/id_rsa')
        return open(path, 'r').read()
        # raise SystemExit('Can not find private key')
            


def get_key_obj(key_str):
    if sys.version_info.major < 3:
        unicode_key = unicode(key_str.strip())
    else:
        unicode_key = key_str.strip()

    key_obj = io.StringIO(unicode_key)
    return paramiko.RSAKey.from_private_key(key_obj)

ns = Collection(
    docker_deploy,
    deploy,
    # composer_install,
    # assets_build,
    docker_cicd_build,
    docker_cicd_push,
    # cicd().deploy,
)
private_key = get_key_obj(get_key_str())
ns.configure({
    'connect_kwargs': {'pkey': private_key}
})