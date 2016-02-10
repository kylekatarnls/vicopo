require 'net/http'
require 'json'

class Vicopo
	def self.http(search)
		uri = URI('http://vicopo.selfbuild.fr/search/' + search.to_s)
		response = JSON.parse(Net::HTTP.get(uri))
		if response['cities']
			return response['cities']
		else
			raise 'No valid answear found.'
		end
	end
	def self.https(search)
		uri = URI('https://www.selfbuild.fr/vicopo/search/' + search.to_s)
		response = JSON.parse(Net::HTTP.get(uri))
		if response['cities']
			return response['cities']
		else
			raise 'No valid answear found.'
		end
	end
end
