# import facebook, twitter, google, vkontakte
import twitter

def include_services(*services):
    return dict((service.SERVICE.name, service.SERVICE) for service in services)

# services = include_services(facebook, twitter, google, vkontakte)
services = include_services(twitter)

def get_services():
    return services

def get_service(service_name):
    return services[str(service_name)]