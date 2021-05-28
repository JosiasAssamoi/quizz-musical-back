import { query } from '../config/database'

const joinPublicGame = async ({ username, user_uuid, themeId }, io, socket) => {
  const game = await query(
    `SELECT * FROM games WHERE is_private=$1 AND state=$2 and theme_id=$3 ORDER BY random() LIMIT 1`,
    [false, 'waiting', themeId]
  )
    .then((res) => {
      return res.rows[0]
    })
    .catch(() => null)
  if (game) {
    await query(`INSERT INTO user_games (user_uuid,game_id) VALUES ($1,$2)`, [user_uuid, game.id])

    const avatar = await query(`SELECT * FROM avatars WHERE user_uuid=$1`, [user_uuid])

    socket.join(game.id)

    io.in(game.id).emit('userJoined', { username, gameID: game.id, avatar })
  } else {
    console.log('echec.')
  }
}

export default joinPublicGame
