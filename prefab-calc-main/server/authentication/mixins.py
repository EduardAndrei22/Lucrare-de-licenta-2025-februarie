from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie


class EnsureCSRFCookieMixin(object):
    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(self).dispatch(*args, **kwargs)
