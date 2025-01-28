
type Participant = {
    playerId: number;
    username: string;
    score: number;
  };

 type GlobalRankProps = {
    participants: Participant[];
  };
 
 export default function GlobalRank({ participants }: GlobalRankProps) {
    return (
        <div className="flex flex-col items-start justify-start self-start gap-4 w-full">
        <div className="flex items-end justify-start row gap-1">
        <svg width="32" height="54" viewBox="0 0 25 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Group 1200">
            <path id="Icon" d="M13.0405 0.307813C12.7999 -0.110742 12.2011 -0.110743 11.9605 0.307813L10.2661 3.2555C10.1472 3.46226 9.9418 3.60336 9.70764 3.63906L6.53219 4.12321C5.99884 4.20452 5.81176 4.88427 6.22712 5.23164L8.5927 7.21002C8.81168 7.39315 8.91464 7.68201 8.86144 7.96399L8.24265 11.2443C8.14483 11.7629 8.6841 12.1658 9.14681 11.9198L12.1369 10.3306C12.3645 10.2096 12.6365 10.2096 12.8641 10.3306L15.8542 11.9198C16.3169 12.1658 16.8562 11.7629 16.7583 11.2443L16.1395 7.96399C16.0863 7.68201 16.1893 7.39315 16.4083 7.21002L18.7739 5.23164C19.1892 4.88427 19.0021 4.20452 18.4688 4.12321L15.2933 3.63906C15.0592 3.60336 14.8538 3.46226 14.7349 3.2555L13.0405 0.307813Z" fill="#F9CF66"/>
            <rect id="Rectangle 2655" x="9.00049" y="14.9939" width="7" height="18" rx="1" fill="#F9CF65"/>
            <rect id="Rectangle 2656" x="0.000488281" y="19.9939" width="7" height="13" rx="1" fill="#F9CF65"/>
            <rect id="Rectangle 2657" x="18.0005" y="24.9939" width="7" height="8" rx="1" fill="#F9CF65"/>
          </g>
        </svg>
 
        <h2 className="font-bold text-4xl">Global Rank - {participants.length} PARTICIPANTS</h2>
        </div>
        <div className="flex flex-col items-center flex-wrap justify-start gap-4 w-full">
          {participants.slice(0, 10).map((participant, index) => (
            <div
              key={index}
              className={`rank ${index === 0 ? 'firstRank' : ''}`}
            >
              <div className="w-16 h-16 avatar flex self-center"> </div>
              <div className="flex flex-col self-center gap-1">
              <p>{participant.username}<span className="text-xs opacity-50">#{participant.playerId}</span></p>
              <p>Score: {participant.score}</p>
              </div>
              <h2 className="flex self-center items-center justify-center rounded-full text-white w-8 h-8">
                {index + 1}
              </h2>
            </div>
          ))}
        </div>
      </div>
    )

 }