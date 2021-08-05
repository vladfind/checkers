import Logic from './Logic.js'

const getVal = (grid) =>
{
  let whites = 0
  let blacks = 0
  let whiteKings = 0
  let blackKings = 0

  for (const row of grid)
  {
    for (const col of row)
    {
      if (Logic.is_empty(col))
      {
        continue
      }
      if (Logic.get_owner(col) === Logic.player1)
      {
        whites++
        if (Logic.is_queen(col))
        {
          whiteKings++
        }
      } else 
      {
        blacks++
        if (Logic.is_queen(col))
        {
          blackKings++
        }
      }
    }
  }
  const val = whites - blacks + (whiteKings * 10) - (blackKings * 10)
  return val
}

const getMoves = (grid, player) =>
{
  let moves = []
  grid.forEach((row, i) =>
  {
    row.forEach((col, j) =>
    {
      if (Logic.get_owner(col) === player)
      {
        const colMoves = Logic.get_moves(grid, i, j)
        const colAttacks = Logic.get_attacks(grid, i, j)
        moves = moves.concat(colAttacks)
        moves = moves.concat(colMoves)
      }
    })
  })
  return moves
}
const copy = Logic.copy
const getBestMove = (grid, depth, player, attacks) =>
{
  let alpha = -Infinity
  let beta = Infinity

  const isMaxing = (player === Logic.player1) ? true : false
  const moves = (attacks) ? attacks : getMoves(grid, player)
  if (isMaxing)
  {
    let maxEval = -Infinity
    let bestMove
    let nextEval
    for (const move of moves)
    {
      const nextGrid = copy(grid)
      if (move.enemy_row === undefined)
      {
        const { start_row, start_col, end_row, end_col } = move
        Logic.move(nextGrid, start_row, start_col, end_row, end_col)
        nextEval = minimax(nextGrid, depth - 1,
          Logic.get_other_player(player), alpha, beta, false)
      } else 
      {
        const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } = move
        Logic.attack(nextGrid, start_row, start_col, enemy_row, enemy_col, end_row, end_col)
        const nextAttacks = Logic.get_attacks(nextGrid, end_row, end_col)
        nextEval = (nextAttacks.length > 0) ?
          minimax(nextGrid, depth - 1, player, alpha, beta, true, nextAttacks) :
          minimax(nextGrid, depth - 1,
            Logic.get_other_player(player), alpha, beta, false)
      }
      
      if (nextEval > maxEval)
      {
        maxEval = nextEval
        bestMove = move
      }
      alpha = Math.max(alpha, nextEval)
      if (beta <= alpha)
      {
        break
      }
    }
    return bestMove
  } else
  {
    let minEval = Infinity
    let bestMove
    let nextEval
    for (const move of moves)
    {
      const nextGrid = copy(grid)
      if (move.enemy_row === undefined)
      {
        const { start_row, start_col, end_row, end_col } = move
        Logic.move(nextGrid, start_row, start_col, end_row, end_col)
        nextEval = minimax(nextGrid, depth - 1,
          Logic.get_other_player(player), alpha, beta, true)
      } else 
      {
        const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } = move
        Logic.attack(nextGrid, start_row, start_col, enemy_row, enemy_col, end_row, end_col)
        const nextAttacks = Logic.get_attacks(nextGrid, end_row, end_col)
        nextEval = (nextAttacks.length > 0) ?
          minimax(nextGrid, depth - 1, player, alpha, beta, false, nextAttacks) :
          minimax(nextGrid, depth - 1,
            Logic.get_other_player(player), alpha, beta, true)
      }
      if (nextEval < minEval)
      {
        minEval = nextEval
        bestMove = move
      }
      beta = Math.min(beta, nextEval)
      if (beta <= alpha)
      {
        break
      }
    }
    return bestMove
  }
}
const minimax = (grid, depth, player, alpha, beta, isMaxing, attacks = false) =>
{
  if (depth === 0 ||
    Logic.check_win(Logic.player1, grid) || 
    Logic.check_win(Logic.player2, grid))
  {
    if (Logic.check_win(Logic.player1, grid))
    {
      console.log('got to win 1')
      return 100000
    } else if(Logic.check_win(Logic.player2, grid))
    {
      console.log('got to win 2')
      return -100000
    }
    return getVal(grid)
  }

  const moves = (attacks) ? attacks : getMoves(grid, player)
  if (isMaxing)
  {
    let maxEval = -Infinity
    let nextEval
    for (const move of moves)
    {
      const nextGrid = copy(grid)
      if (move.enemy_row === undefined)
      {
        const { start_row, start_col, end_row, end_col } = move
        Logic.move(nextGrid, start_row, start_col, end_row, end_col)
        nextEval = minimax(nextGrid, depth - 1, 
          Logic.get_other_player(player), alpha, beta, false)
      } else 
      {
        const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } = move
        Logic.attack(nextGrid, start_row, start_col, enemy_row, enemy_col, end_row, end_col)
        const nextAttacks = Logic.get_attacks(nextGrid, end_row, end_col)
        nextEval = (nextAttacks.length > 0) ?
          minimax(nextGrid, depth - 1, player, alpha, beta, true, nextAttacks) :
          minimax(nextGrid, depth - 1,
             Logic.get_other_player(player), alpha, beta, false)
      }
      maxEval = Math.max(maxEval, nextEval)
      alpha = Math.max(alpha, nextEval)
      if (beta <= alpha)
      {
        break
      }
    }
    return maxEval
  } else
  {
    let minEval = Infinity
    let nextEval
    for (const move of moves)
    {
      const nextGrid = copy(grid)
      if (move.enemy_row === undefined)
      {
        const { start_row, start_col, end_row, end_col } = move
        Logic.move(nextGrid, start_row, start_col, end_row, end_col)
        nextEval = minimax(nextGrid, depth - 1,
           Logic.get_other_player(player), alpha, beta, true)
      } else 
      {
        const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } = move
        Logic.attack(nextGrid, start_row, start_col, enemy_row, enemy_col, end_row, end_col)
        const nextAttacks = Logic.get_attacks(nextGrid, end_row, end_col)
        nextEval = (nextAttacks.length > 0) ?
          minimax(nextGrid, depth - 1, player, alpha, beta, false, nextAttacks) :
          minimax(nextGrid, depth - 1, 
            Logic.get_other_player(player), alpha, beta, true)
      }
      minEval = Math.min(minEval, nextEval)
      beta = Math.min(beta, nextEval)
      if (beta <= alpha)
      {
        break
      }
    }
    return minEval
  }

}
export default getBestMove