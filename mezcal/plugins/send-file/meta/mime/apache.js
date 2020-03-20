export const source = 'https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types';

export const parser = file =>
  file
    .split(/\n/)
    .flatMap(it => it.split('#', 1))
    .filter(it => it)
    .map(l => l.split(/\t/).filter(it => it))
    .map(([mime, extensions]) => ({ mime, extensions: extensions.split(' ') }));
