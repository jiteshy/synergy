export interface Config {
  synergy: {
    /**
     * Synergy plugin providers
     */
    provider: {
      /**
       * Github provider configuration
       */
      github: {
        /**
         * GitHub Org name you want to fetch the Inner-Source projects and issues from
         */
        org: string;

        /**
         * GitHub host url e.g. https://github.com
         */
        host: string;

        /**
         * Base url to call GitHub APIs e.g. https://api.github.com
         */
        apiBaseUrl: string;

        /**
         * GitHub access token
         * @visibility secret
         */
        token: string;
      };
    };

    /**
     * Topic or Label used for Inner-Source projects or issues e.g. "inner-source"
     */
    repoTag: string;
  };
}
