import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Heart, Repeat, Shuffle, Home, Search, Library, Plus, SkipBack, SkipForward, Clock, Music, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const playlists = [
  {
    id: 1,
    name: "Chill Mix",
    coverUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: 2,
    name: "Focus Flow",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: 3,
    name: "Deep House",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=300"
  }
];

const songs = [
  {
    id: 1,
    title: "Starlight",
    artist: "The Midnight",
    album: "Monsters",
    duration: "4:39",
    coverUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Neon Dreams",
    artist: "Synthwave Collective",
    album: "Retro Future",
    duration: "4:15",
    coverUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Digital Sunset",
    artist: "Cyber Dreams",
    album: "Neon City",
    duration: "3:43",
    coverUrl: "https://images.unsplash.com/photo-1492760864391-753aaae87234?auto=format&fit=crop&q=80&w=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Midnight Drive",
    artist: "Retrowave",
    album: "Night Rider",
    duration: "5:22",
    coverUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

const featuredPlaylists = [
  {
    id: 1,
    name: "Liked Songs",
    description: "Your favorite tracks",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400",
    type: "Playlist"
  },
  {
    id: 2,
    name: "Daily Mix 1",
    description: "Personalized selection for you",
    coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80&w=400",
    type: "Mix"
  },
  {
    id: 3,
    name: "This is MPB",
    description: "The best of Brazilian Popular Music",
    coverUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=400",
    type: "Artist Mix"
  },
  {
    id: 4,
    name: "Discover Weekly",
    description: "New music recommendations",
    coverUrl: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?auto=format&fit=crop&q=80&w=400",
    type: "Playlist"
  }
];

const Spotify = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const loadAndPlaySong = async () => {
      if (!audioRef.current) return;
      
      setIsLoading(true);
      try {
        audioRef.current.src = currentSong.url;
        await audioRef.current.load();
        if (isPlaying) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error loading audio:', error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndPlaySong();
  }, [currentSong]);

  useEffect(() => {
    const playOrPause = async () => {
      if (!audioRef.current) return;

      try {
        if (isPlaying) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } catch (error) {
        console.error('Error controlling playback:', error);
        setIsPlaying(false);
      }
    };

    playOrPause();
  }, [isPlaying]);

  const togglePlay = async () => {
    if (isLoading) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || isLoading) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLoading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pos);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const getNextSong = () => {
    if (isShuffled) {
      const availableSongs = songs.filter(song => song.id !== currentSong.id);
      return availableSongs[Math.floor(Math.random() * availableSongs.length)];
    }
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    return songs[(currentIndex + 1) % songs.length];
  };

  const getPreviousSong = () => {
    if (isShuffled) {
      const availableSongs = songs.filter(song => song.id !== currentSong.id);
      return availableSongs[Math.floor(Math.random() * availableSongs.length)];
    }
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    return songs[(currentIndex - 1 + songs.length) % songs.length];
  };

  const playNext = () => {
    if (isLoading) return;
    const nextSong = getNextSong();
    setCurrentSong(nextSong);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (isLoading) return;
    const previousSong = getPreviousSong();
    setCurrentSong(previousSong);
    setIsPlaying(true);
  };

  const handleSongClick = (song: typeof songs[0]) => {
    if (isLoading) return;
    
    if (currentSong.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-black/90 z-50 p-4">
        <Link
          to="/"
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para Home
        </Link>
      </div>
      
      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <div className="w-64 bg-black flex flex-col h-[calc(100vh-90px)]">
          <div className="bg-[#121212] rounded-lg p-4 mb-2 mx-2 mt-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-gray-300 hover:text-white cursor-pointer">
                <Home className="h-6 w-6" />
                <span className="font-semibold">Home</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-300 hover:text-white cursor-pointer">
                <Search className="h-6 w-6" />
                <span className="font-semibold">Search</span>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] rounded-lg flex-1 p-4 mx-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-gray-300 hover:text-white cursor-pointer">
                <Library className="h-6 w-6" />
                <span className="font-semibold">Your Library</span>
              </div>
              <button className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] p-2 rounded-full">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  className="flex items-center space-x-3 group cursor-pointer p-2 rounded-md hover:bg-[#2a2a2a]"
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white group-hover:text-white">{playlist.name}</p>
                    <p className="text-sm text-gray-400">Playlist</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto h-[calc(100vh-90px)]">
          <div className="p-6">
            {/* Featured Playlists */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Good evening</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredPlaylists.map(playlist => (
                  <div
                    key={playlist.id}
                    className="group relative bg-[#181818] hover:bg-[#282828] rounded-md p-4 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-16 h-16 object-cover rounded-md shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:underline">{playlist.name}</h3>
                        <p className="text-sm text-gray-400">{playlist.type}</p>
                      </div>
                    </div>
                    <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <Play className="h-6 w-6 text-black ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Songs */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Popular Songs</h2>
              {/* Table Header */}
              <div className="grid grid-cols-[16px,4fr,2fr,1fr] gap-4 px-4 py-2 text-gray-400 border-b border-gray-800 sticky top-0 bg-[#121212] z-10">
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <div className="flex justify-end">
                  <Clock className="h-5 w-5" />
                </div>
              </div>

              {/* Songs List */}
              <div className="mt-4">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                    className={`group grid grid-cols-[16px,4fr,2fr,1fr] gap-4 px-4 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer ${
                      currentSong.id === song.id ? 'bg-[#2a2a2a]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {currentSong.id === song.id && isPlaying ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <span className="block w-1 h-4 bg-green-500 animate-pulse" />
                        </div>
                      ) : (
                        <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                      )}
                      <Play className="h-4 w-4 text-white hidden group-hover:block" />
                    </div>

                    <div className="flex items-center gap-4">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h3 className={`font-medium ${
                          currentSong.id === song.id ? 'text-green-500' : 'text-white'
                        }`}>
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-400">
                      {song.album}
                    </div>

                    <div className="flex items-center justify-end gap-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            likedSongs.includes(song.id)
                              ? 'text-green-500 fill-green-500'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-400">{song.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-4 h-[90px]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4 min-w-[180px] w-[30%]">
            {currentSong && (
              <>
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-14 h-14 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{currentSong.title}</h4>
                  <p className="text-xs text-gray-400">{currentSong.artist}</p>
                </div>
                <button
                  onClick={() => toggleLike(currentSong.id)}
                  className="hover:scale-105 transition-transform"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      likedSongs.includes(currentSong.id)
                        ? 'text-green-500 fill-green-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col items-center max-w-[45%] w-full gap-2">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`hover:scale-105 transition-transform ${
                  isShuffled ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white hover:scale-105 transition-transform"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-black" />
                ) : (
                  <Play className="h-4 w-4 text-black ml-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white hover:scale-105 transition-transform"
              >
                <SkipForward className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`hover:scale-105 transition-transform ${
                  isRepeating ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Repeat className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressBarRef}
                className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gray-200 group-hover:bg-green-500 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                </div>
              </div>
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[180px] w-[30%] justify-end">
            <Volume2 className="h-5 w-5 text-gray-400" />
            <div
              className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer group"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-gray-200 group-hover:bg-green-500 rounded-full relative"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        loop={isRepeating}
      />
    </div>
  );
};

export default Spotify;
