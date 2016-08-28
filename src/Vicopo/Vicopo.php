<?php

namespace Vicopo;

class Vicopo {

	static protected function get($search, $protocol = 'https') {
		$vicopoUrl = $protocol . '://vicopo.selfbuild.fr/search/' . urlencode($ville);
		$json = @json_decode(file_get_contents($vicopoUrl));
		if (!is_object($json) || !isset($json->cities)) {
			throw new Exception("No valid answear found", 1);
		}
		return $json->cities;
	}

	static public function http($search) {
		return static::get($search, 'http');
	}

	static public function https($search) {
		return static::get($search, 'https');
	}
}
