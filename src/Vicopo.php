<?php

namespace Vicopo;

use Exception;

class Vicopo {

    /**
     * Search on VICOPO server.
     *
     * @param string $search   city name or zip code
     * @param string $protocol http or https
     *
     * @return array
     *
     * @throws Exception
     */
	static protected function get($search, $protocol = 'https') {
		$vicopoUrl = $protocol . '://vicopo.selfbuild.fr/search/' . urlencode($search);
		$json = @json_decode(file_get_contents($vicopoUrl));
		if (!is_object($json) || !isset($json->cities)) {
			throw new Exception("No valid answear found", 1);
		}
		return $json->cities;
	}

    /**
     * Search on VICOPO server via HTTP.
     *
     * @param string $search   city name or zip code
     *
     * @return array
     *
     * @throws Exception
     */
	static public function http($search) {
		return static::get($search, 'http');
	}

    /**
     * Search on VICOPO server via HTTPS.
     *
     * @param string $search   city name or zip code
     *
     * @return array
     *
     * @throws Exception
     */
	static public function https($search) {
		return static::get($search, 'https');
	}
}
