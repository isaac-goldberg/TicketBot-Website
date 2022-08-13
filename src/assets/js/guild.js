function setModule(name) {
    $('.module').hide();
    $(`#${name}Module`).show();
    $(`#${name}`).addClass('active');
}

const path = window.location.href.split('/');

const module = path[5];

if ($(`#${module}Module`)) {
    setModule(module);
} else {
    setModule('overview');
}