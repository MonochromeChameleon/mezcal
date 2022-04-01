export const source = 'https://raw.githubusercontent.com/nginx/nginx/master/conf/mime.types';

export const parser = file =>
  file
    .split(/\n/)
    .slice(2, -2)
    .join(' ')
    .split(';')
    .filter(it => it)
    .map(it => it.split(' ').filter(i => i))
    .map(([mime, ...extensions]) => ({ mime, extensions }));
