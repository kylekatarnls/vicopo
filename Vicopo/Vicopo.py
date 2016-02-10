import urllib, json

class Vicopo:
    @staticmethod
    def http(search):
        response = urllib.urlopen('http://vicopo.selfbuild.fr/search/' + str(search))
        return json.loads(response.read())
    @staticmethod
    def https(search):
        response = urllib.urlopen('https://www.selfbuild.fr/vicopo/search/' + str(search))
        return json.loads(response.read())
