import ReactPlayer from 'react-player';
import Card from '../../common/Card';

const VideoPlayer = ({ videoUrl }) => {
  return (
    <Card padding="none" className="mb-6 overflow-hidden">
      <div className="bg-black">
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="600px"
          playing={false}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>
    </Card>
  );
};

export default VideoPlayer;
