/**
 * @file Tile class that holds all information for a tile and gives board access to it.
 * @author Ryan Pope, Giang Nguyen, Hirsh Guha, Jordan Love, John Quitno
 * 
 */
class Tile {
    /**
        * Creates the Tile.
        * @constructor
        * @param {number} newNumber - The number of adjacent tiles that have a bomb.
        * @param {bool} newFlag -Bool indicating if the tile is falgged.
        */
    constructor(newNumber, newFlag)
    {
        this.number = newNumber;
        this.flag = newFlag;
        this.revealed = false;
    }

    /**
        * Sets number of adjacent mines.
        * @param {number}num - The number of adjacent tiles that have a bomb.
        */
    setNumber(num)
    {
        this.number = num;
    }

    /**
        * Gets number of adjacent mines.
        * @return {number} - Returns number of adjacent mines.
        */
    get getNumber()
    {
        return this.number;
    }

    /**
        * Sets the flag status.
        * @param {bool} flagStatus - Sets the flag status.
        */
    setFlag(flagStatus)
    {
        this.flag = flagStatus;
    }

    /**
        * Gets bool of whether there is a flag.
        * @return {bool} - Returns bool indicating flagged.
        */
    get getFlag()
    {
        return this.flag;
    }

    /**
        * sets the number to -1 indicating that it's a mine.
        */
    setMine()
    {
        this.number = -1;
    }

    /**
        * Returns bool indicating if there is a mine.
        *  @return {bool} - Returns bool indicating mine.
        */
    isMine()
    {
        return (this.number==-1);
    }

    /**
        * sets tile to revealed.
        */
    setRevealed(revealedStatus)
    {
        this.revealed = revealedStatus;
    }

    /**
        * Returns bool indicating if its revealed.
        *  @return {bool} - Returns bool indicating revealed.
        */
    get getRevealed()
    {
        return this.revealed;
    }
}
