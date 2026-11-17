{
  description = "Reproducible Node.js server environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {

      apps = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};

          startScript = pkgs.writeShellApplication {
            name = "start-server";
            runtimeInputs = [ pkgs.nodejs_22 ];
            text = ''
              npm install
              npm run start
            '';
          };
        in
        {
          default = {
            type = "app";
            program = "${startScript}/bin/start-server";
          };
        });
    };
}
