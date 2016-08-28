require 'net/http'
require 'json'

class Vicopo
	def self.get(search, protocol = 'https')
		uri = URI(protocol + '://vicopo.selfbuild.fr/search/' + search.to_s)
		response = JSON.parse(Net::HTTP.get(uri))
		if response['cities']
			return response['cities']
		else
			raise 'No valid answear found.'
		end
	end
	def self.http(search)
		return self.get(search, 'http')
	end
	def self.https(search)
		return self.get(search, 'https')
	end
end
