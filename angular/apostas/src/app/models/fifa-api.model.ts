export interface FifaCompetitionResponse {
  IdSeason: string;
  IdCompetition: string;
  Name: string[];
  Properties: {
    Ident: string;
    IsActive: boolean;
  };
}

export interface FifaMatchesResponse {
  Results: {
    IdMatch: string;
    IdCompetition: string;
    Date: string;
    MatchStatus: string;
    Home: {
      IdTeam: string;
      PictureUrl: string;
      TeamName: [{
        Locale: string;
        Description: string;
      }];
      Score?: number;
    };
    Away: {
      IdTeam: string;
      PictureUrl: string;
      TeamName: [{
        Locale: string;
        Description: string;
      }];
      Score?: number;
    };
  }[];
} 