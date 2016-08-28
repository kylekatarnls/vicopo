import urllib, json

class Vicopo:
    @staticmethod
    def get(search, protocol = 'https'):
        response = urllib.urlopen(protocol + '://vicopo.selfbuild.fr/search/' + str(search))
        return json.loads(response.read())
    @staticmethod
    def http(search):
        return Vicopo.get(search, 'http')
    @staticmethod
    def https(search):
        return Vicopo.get(search, 'https')
