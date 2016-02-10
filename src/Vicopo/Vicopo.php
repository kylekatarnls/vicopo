<?php

namespace Vicopo;

class Vicopo {

	static protected function get($url, $search) {
		$vicopoUrl = $url . urlencode($ville);
		$json = @json_decode(file_get_contents($vicopoUrl));
		if (!is_object($json) || !isset($json->cities)) {
			throw new Exception("No valid answear found", 1);
		}
		return $json->cities;
	}

	static public function http($search) {
		return static::get('http://vicopo.selfbuild.fr/search/', $search);
	}

	static public function https($search) {
		return static::get('https://www.selfbuild.fr/vicopo/search/', $search);
	}
}
